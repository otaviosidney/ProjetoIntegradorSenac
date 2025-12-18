const envs_arr = [
    "SERVER_PORT",
    "DATABASE_URL"
];

function verifyEnv(envs=envs_arr) {
    envs_arr.forEach(env => {
        if (!process.env[env]) {
            throw new Error(`Variável de ambiente ausente: ${env}`);
        }
    });

    console.log("Todas as variáveis de ambiente estão presentes!");
}

module.exports = {
    verifyEnv
};