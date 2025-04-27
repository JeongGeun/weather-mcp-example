import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAlertsTool } from './alertsTool.js';
import { registerForecastTool } from './forecastTool.js';

// Create a single server instance
const server = new McpServer({
  name: 'weather',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register both tools to the same server
registerAlertsTool(server);
registerForecastTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Weather MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
