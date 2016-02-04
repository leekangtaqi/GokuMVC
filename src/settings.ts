const baseSettings = {
    env: {
        name: 'dev'
    },

    logging: {
        reloadSecs: 0, //INFO: set 0 could let nodeunit tests which use log4js exit properly
        level: 'DEBUG'
    },

    redis: {
        mode: 'single',
        host: '127.0.0.1',
        port: 6379,
        auth: 'trillers'
    },

    mongo: {
        host: "127.0.0.1",
        port: 27017,
        db: "note",
        username: '',
        password: ''
    }
};
export = baseSettings;
