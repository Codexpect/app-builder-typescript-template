async function main() {
    await require("../scripts/sync-oauth-credentials").main();
    await require("../scripts/sync-workspace-configuration").main();
    await require("../scripts/sync-default-configuration").main();
}

exports.main = main;
