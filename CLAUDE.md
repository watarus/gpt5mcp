
10. **grok-server** - X/Twitter search and content retrieval using Grok API
    - Environment: `GROK_API_KEY`
    - Command: `node /Users/kristianfagerlie/apps/gpt5mcp/servers/grok-server/build/index.js`
    - Tools: `search_x`, `search_trending`, `search_by_handles`, `search_popular_posts`

11. **gpt5-server** - OpenAI GPT-5 API integration for text generation
    - Environment: `OPENAI_API_KEY`
    - Command: `node /Users/kristianfagerlie/apps/gpt5mcp/servers/gpt5-server/build/index.js`
    - Tools: `gpt5_generate`, `gpt5_messages`

### Environment Variables
All API keys are stored in `/servers/.env`:
- `GROK_API_KEY`
- `OPENAI_API_KEY`


Grok Server - X/Twitter search and content retrieval
claude mcp add grok-server -e GROK_API_KEY=xai-your-grok-api-key-here -- node /Users/kristianfagerlie/apps/fplai/servers/grok-server/build/index.js
