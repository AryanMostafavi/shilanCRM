module.exports = {
    apps: [
        {
            name: "form_builder",
            script: "./index.js",
            instances: "max",
            exec_mode: "cluster",
            watch: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
