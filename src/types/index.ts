export interface Message {
    role: string;
    content: string;
    tool_calls?: any[];
  }
  
  export interface RequestBody {
    messages: Message[];
    show_intermediate_steps?: boolean;
  }