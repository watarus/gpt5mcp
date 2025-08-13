# GPT-5 MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with OpenAI's GPT-5 API through Claude Code. This server enables you to leverage GPT-5's advanced capabilities directly within your Claude Code workflows.

## 🚀 Features

- **Direct GPT-5 Integration**: Call GPT-5 API with simple prompts or structured conversations
- **OpenRouter Support**: Access various models through OpenRouter API (Claude, GPT-4, etc.)
- **Two Powerful Tools**:
  - `gpt5_generate`: Simple text generation with prompts
  - `gpt5_messages`: Structured conversation handling with message arrays
- **Built for Claude Code**: Optimized for seamless integration with Anthropic's Claude Code IDE
- **TypeScript Support**: Fully typed for better development experience
- **Error Handling**: Robust error handling with detailed feedback
- **Usage Tracking**: Built-in token usage reporting

## 📋 Prerequisites

- Node.js (v18 or higher)
- Either:
  - OpenAI API key with GPT-5 access, OR
  - OpenRouter API key for accessing various models
- Claude Code IDE

## 🛠 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AllAboutAI-YT/gpt5mcp.git
cd gpt5mcp
```

### 2. Install Dependencies

```bash
cd servers/gpt5-server
npm install
```

### 3. Build the Server

```bash
npm run build
```

### 4. Configure Environment Variables

Create a `.env` file in the `servers` directory:

```bash
# servers/.env
# Option 1: Use OpenAI directly
OPENAI_API_KEY=your-openai-api-key-here

# Option 2: Use OpenRouter (for various models)
OPENROUTER_API_KEY=your-openrouter-api-key-here

# You can configure both and switch between them
```

## 🔧 Claude Code Integration

### Add the Server to Claude Code

#### Option 1: With OpenAI API
```bash
claude mcp add gpt5-server -e OPENAI_API_KEY=your-openai-api-key-here -- node /path/to/gpt5mcp/servers/gpt5-server/build/index.js
```

#### Option 2: With OpenRouter API
```bash
claude mcp add gpt5-server -e OPENROUTER_API_KEY=your-openrouter-api-key-here -- node /path/to/gpt5mcp/servers/gpt5-server/build/index.js
```

#### Option 3: With Both APIs
```bash
claude mcp add gpt5-server -e OPENAI_API_KEY=your-openai-key -e OPENROUTER_API_KEY=your-openrouter-key -- node /path/to/gpt5mcp/servers/gpt5-server/build/index.js
```

### Verify Installation

Test the server with a simple query:

```
Ask GPT-5: "Hello, how are you today?"
```

## 📚 Available Tools

### `gpt5_generate`

Generate text using a simple input prompt.

**Parameters:**
- `input` (required): The text prompt for GPT-5
- `model` (optional): Model to use (default: "gpt-5" for OpenAI, "openai/gpt-4o" for OpenRouter)
- `instructions` (optional): System instructions for the model
- `reasoning_effort` (optional): Reasoning level ("low", "medium", "high") - OpenAI only
- `max_tokens` (optional): Maximum tokens to generate
- `temperature` (optional): Randomness level (0-2)
- `top_p` (optional): Top-p sampling parameter (0-1)
- `use_openrouter` (optional): Force using OpenRouter instead of OpenAI

### `gpt5_messages`

Generate text using structured conversation messages.

**Parameters:**
- `messages` (required): Array of conversation messages with role and content
- `model` (optional): Model to use (default: "gpt-5" for OpenAI, "openai/gpt-4o" for OpenRouter)
- `instructions` (optional): System instructions for the model
- `reasoning_effort` (optional): Reasoning level ("low", "medium", "high") - OpenAI only
- `max_tokens` (optional): Maximum tokens to generate
- `temperature` (optional): Randomness level (0-2)
- `top_p` (optional): Top-p sampling parameter (0-1)
- `use_openrouter` (optional): Force using OpenRouter instead of OpenAI

**Message Format:**
```json
{
  "messages": [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What about Germany?"}
  ]
}
```

## 🎯 Usage Examples

### Simple Text Generation

```typescript
// Using OpenAI GPT-5
{
  "input": "Explain quantum computing in simple terms",
  "reasoning_effort": "high",
  "max_tokens": 500
}

// Using OpenRouter with Claude
{
  "input": "Explain quantum computing in simple terms",
  "model": "anthropic/claude-3.5-sonnet",
  "use_openrouter": true,
  "max_tokens": 500
}
```

### Conversation Handling

```typescript
// Using the gpt5_messages tool
{
  "messages": [
    {"role": "user", "content": "I'm learning Python. Can you help?"},
    {"role": "assistant", "content": "I'd be happy to help you learn Python! What specific topic would you like to start with?"},
    {"role": "user", "content": "Let's start with variables and data types."}
  ],
  "instructions": "Be a helpful Python tutor",
  "reasoning_effort": "medium"
}
```

## 📁 Project Structure

```
gpt5mcp/
├── servers/
│   └── gpt5-server/
│       ├── src/
│       │   ├── index.ts          # Main server implementation
│       │   └── utils.ts          # GPT-5 API utilities
│       ├── build/                # Compiled TypeScript output
│       ├── package.json          # Dependencies and scripts
│       └── tsconfig.json         # TypeScript configuration
├── CLAUDE.md                     # Claude Code configuration
├── GPT5-MCP-Server-Guide.html    # Interactive setup guide
├── .gitignore                    # Git ignore patterns
└── README.md                     # This file
```

## 🛡️ Security

- API keys are loaded from environment variables (never hardcoded)
- The `.env` file is automatically excluded from version control
- All API communications use secure HTTPS
- Error messages don't expose sensitive information

## 🔄 Development

### Scripts

- `npm run build`: Compile TypeScript and set permissions
- `npm run start`: Start the compiled server
- `npm run dev`: Build and start in development mode

### Making Changes

1. Edit TypeScript files in `src/`
2. Run `npm run build` to compile
3. Restart Claude Code MCP server if needed

## 🐛 Troubleshooting

### Common Issues

**Server not found in Claude Code:**
```bash
# Remove and re-add the server
claude mcp remove gpt5-server
claude mcp add gpt5-server -e OPENAI_API_KEY=your-key -- node /path/to/build/index.js
```

**API Key Issues:**
- For OpenAI: Ensure your API key has GPT-5 access
- For OpenRouter: Ensure your API key is valid
- Verify the key is correctly set in the `.env` file
- Check that the environment variable is properly loaded
- The server will automatically use OpenRouter if only `OPENROUTER_API_KEY` is set

**Build Errors:**
```bash
# Clean rebuild
rm -rf build/
npm run build
```

## 📖 Interactive Guide

Open `GPT5-MCP-Server-Guide.html` in your browser for an interactive, step-by-step setup guide with copy-paste commands.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature-name'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/servers) by Anthropic
- Powered by OpenAI's GPT-5 API
- Created for the Claude Code community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AllAboutAI-YT/gpt5mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AllAboutAI-YT/gpt5mcp/discussions)
- **Documentation**: [MCP Documentation](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)

---

⭐ **Star this repo if you found it helpful!**
