const fetch = require('node-fetch');
const { SLACK_WEBHOOK_URL, SLACK_WEBHOOK_TIMEOUT } = require('./config');
const debug = require('debug')('talk:plugin:slack-notifications');

// We don't add the hooks during _test_ as the Slack API is not available.
if (process.env.NODE_ENV === 'test') {
  return null;
}

module.exports = {
  RootMutation: {
    createComment: {
      async post(root, args, context, info, result) {
        debug(`Posting notification to Slack webhook: ${SLACK_WEBHOOK_URL}`);
        const { comment: { asset_id, body: text, created_at: createdAt } } = result;
        const username = context.user.username;
        const asset = await context.loaders.Assets.getByID.load(asset_id);
        process.nextTick(async () => {
          const response = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: SLACK_WEBHOOK_TIMEOUT,
            body: JSON.stringify({
              attachments: [
                {
                  text: text + "\n" + asset.title + "\n" + asset.url,
                  footer: `Comment by ${username}`,
                  ts: Math.floor(Date.parse(createdAt) / 1000),
                },
              ],
            }),
          });
          if (!response.ok) {
            const responseText = await response.text();
            console.trace(
              `Posting to Slack failed with HTTP code ${
                response.status
              } and body '${responseText}'`
            );
          }
        });
        return result;
      },
    },
  },
};
