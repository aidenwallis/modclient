import config from '../../../config.json';

const loginUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${config.clientId}&redirect_uri=${config.redirect}&scope=chat_login+user_subscriptions`;

export default loginUrl;
