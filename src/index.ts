import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AgentRuntime, createAptosTools,LocalSigner } from "../agent/index";

dotenv.config();

const app:express.Application = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Anthropic LLM
const llm = new ChatAnthropic({
  temperature: 0.7,
  model: "claude-3-5-sonnet-latest",
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

// Message converter function
const convertLangChainMessageToVercelMessage = (message: any) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: message.tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    // Initialize Aptos configuration
    const aptosConfig = new AptosConfig({
      network: Network.TESTNET,
    });

    const aptos = new Aptos(aptosConfig);

    // Validate and get private key from environment
    const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
			privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)),
		})

    const signer = new LocalSigner(account, Network.TESTNET);
    const aptosAgent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: process.env.PANORA_API_KEY || "",
    });
    const tools = createAptosTools(aptosAgent);
    const memory = new MemorySaver();
    const metadataList=req.body.metadataList;
    const gameData=req.body.gameData;
    const accountAddress=req.body.accountAddress;

    // Create React agent
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
   # Aptos Agent Assistant

    You are a specialized onchain assistant using the Aptos Agent Kit. Your primary functions are:

    #Betting analysis
    - Analyze player performance metrics (games played, wins, win rate, GH token balance, average bet)
    - Whenever you need to interact with the blockchain, use the provided account address: ${JSON.stringify(accountAddress)}

      ## Game Analysis & Strategy
  - Analyze the provided gameDetails: ${JSON.stringify(gameData)}
  - Assess each player's position (gems collected, punches received, remaining cards)
  - Recommend optimal moves based on maximizing gem collection while minimizing punches received
  - Consider the current round, remaining cards, and opponents' likely strategies
  - The winner is determined by highest gem count with fewest punches received as the tiebreaker
  
  ## Move Recommendation Logic
  - ALWAYS evaluate the three possible moves (Punch, Shield, Grab) in the current context
  - Suggest the move with highest expected value considering:
    • Current gem distribution among players
    • Punch count received by each player
    • Remaining cards in players' hands
    • Round number and potential end-game scenarios
  - Provide brief strategic reasoning for your recommended move
    
    ## Core Capabilities
    - Execute onchain transactions using provided tools
    - Analyze player performance metrics (games played, wins, win rate, GH token balance, average bet)
    - Provide data-driven betting recommendations
    - Analyze card metadata to suggest optimal card purchases
    
    ## Token Handling
    - ALWAYS display token amounts according to their decimal precision
    - Retrieve funds from the faucet when needed
    - Help users manage their wallet funds

      ## Card Analysis
    - Available card metadata: ${JSON.stringify(metadataList)}
    - Use this data to recommend which cards the user should purchase
    - Also in your response don't need to include image or description.
    - Also the price mentioned is in APT not in GH.

    ## Game Knowledge
    This pirate-themed multiplayer card game features:
    - 3 rounds of competitive gem collection
    - Turn-based gameplay with 3 card types:
      • Punch: Attack to make opponents drop gems
      • Shield: Protect from attacks
      • Grab: Collect gems from the treasure
    - Technical implementation using Three.js, PlayroomKit for multiplayer, and Framer Motion

    ## Response Guidelines
    - Be concise and direct
    - For 5XX errors, ask the user to try again later
    - If a requested action is beyond your tools, acknowledge limitations and suggest DIY implementation using Aptos Agent Kit
    - Don't restate tool descriptions unless specifically asked
  `,
    });

    // Parse request body
    const messages = req.body.messages ?? [];
    const showIntermediateSteps = req.body.show_intermediate_steps ?? false;

    if (!showIntermediateSteps) {
      // Stream response
      const eventStream = await agent.streamEvents(
        { messages },
        {
          version: "v2",
          configurable: {
            thread_id: "Aptos Agent Kit!",
          },
        }
      );

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Stream chunks to response
      for await (const { event, data } of eventStream) {
        if (event === "on_chat_model_stream") {
          if (data.chunk.content) {
            if (typeof data.chunk.content === "string") {
              res.write(data.chunk.content);
            } else {
              for (const content of data.chunk.content) {
                res.write(content.text ? content.text : "");
              }
            }
          }
        }
      }
      res.end();
    } else {
      // Return complete response with intermediate steps
      const result = await agent.invoke({ messages });
      res.json({
        messages: result.messages.map(convertLangChainMessageToVercelMessage),
      });
    }
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
      status: "error"
    });
  }
});


// Add this new endpoint to your existing Express app
// Add this new endpoint to your existing Express app
app.post('/api/pick-winner', async (req, res) => {
  try {
    const { assetType } = req.body;
    
    if (!assetType) {
      res.status(400).json({ error: 'Asset type is required' });
    } else {
      // Initialize Aptos configuration (reusing your existing code)
      const aptosConfig = new AptosConfig({
        network: Network.TESTNET,
      });
      
      const aptos = new Aptos(aptosConfig);
      
      // Validate and get private key from environment
      const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
      if (!privateKeyStr) {
        throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
      }
      
      // Setup account and signer (reusing your existing code)
      const account = await aptos.deriveAccountFromPrivateKey({
        privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)),
      });

      // Create the transaction payload - using the entry function approach
      const moduleAddress = process.env.MODULE_ADDRESS_TOKEN;
      const winnerAddress=req.body.winnerAddress;
      // Following the latest Aptos TS SDK pattern from the docs
      // Generate the raw transaction
      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${moduleAddress}::launchpad::pickWinner`,
          functionArguments: [assetType, winnerAddress],
          typeArguments: [],
        }
      });

      // Sign the transaction
      const senderAuthenticator = await aptos.transaction.sign({
        signer: account,
        transaction: transaction,
      });

      // Submit the transaction
      const pendingTxn = await aptos.transaction.submit.simple({
        transaction: transaction,
        senderAuthenticator,
      });
      
      // Wait for transaction to complete
      const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
      });
      
      res.json({
        success: true,
        transactionHash: pendingTxn.hash,
        result: txnResult
      });
    }
  } catch (error) {
    console.error('Error picking winner:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
      status: "error"
    });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

