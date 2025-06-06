import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { makeNWSRequest, AlertsResponse, NWS_API_BASE } from '@/nwsApi';
import { formatAlert } from '@/alertFormatter';
import { z } from 'zod';

export function registerAlertsTool(server: McpServer) {
  server.tool(
    'get-alerts',
    'Get weather alerts for a state',
    {
      state: z
        .string()
        .length(2)
        .describe('Two-letter state code (e.g. CA, NY)'),
    },
    async ({ state }) => {
      const stateCode = state.toUpperCase();
      const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
      const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

      if (!alertsData) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve alerts data',
            },
          ],
        };
      }

      const features = alertsData.features || [];
      if (features.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No active alerts for ${stateCode}`,
            },
          ],
        };
      }

      const formattedAlerts = features.map(formatAlert);
      const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join(
        '\n'
      )}`;

      return {
        content: [
          {
            type: 'text',
            text: alertsText,
          },
        ],
      };
    }
  );
}
