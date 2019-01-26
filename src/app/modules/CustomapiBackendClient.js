import makeApiClient from '../util/makeApiClient';

class CustomapiBackendClient {
    constructor() {
        this.client = makeApiClient('http://localhost:8000/')
    }

    fetchChatters(channelName) {
        return this.client.get(`v1/chatters/${channelName}`)
            .then((res) => res.data.data)
            .then((data) => data.chatters)
            .then((chatters) => [
                ...chatters.vips,
                ...chatters.moderators,
                ...chatters.staff,
                ...chatters.admins,
                ...chatters.viewers,
            ]);
    }
}

export default CustomapiBackendClient;