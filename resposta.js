const fs = require('fs');
const path = require('path');
const { Console } = console;

// Criando o arquivo de log
const filePath = path.resolve(__dirname, 'errors.log');
const output = fs.createWriteStream(filePath, { flags: 'a' });

// Configurando o logger
const logger = new Console(output);


async function upload(passChance) {
	return new Promise((resolve, reject) => {
		if (passChance)
			resolve("Upload concluído com sucesso ");
		else
			reject("Upload falhou ")
	})
}

function generatePassPercent(percent) {
	return (Math.random() < percent ? 1 : 0);
}

const requests = Array.from({ length: 5 }, () => generatePassPercent(0.8));

let allPromises = 0;
let rejectedPromises = 0;
let resolvedPromises = 0;

async function fazerUpload(requests) {
	const promises = requests.map(async passChance => {
		allPromises++;

		try {
			const response = await upload(passChance);

			resolvedPromises++;

			return response;

		} catch (error) {
			logger.log(`Promise rejeitada: \n  Mensagem: ${error} \n  Data-hora: ${new Date()} \n `);

			rejectedPromises++;

			return error;
		}
	});

	return promises;
}

async function executaPromises(promises) {
	const response = await Promise.all(promises);

	return response;
}

async function executar(requests) {
	const promises = await fazerUpload(requests);

	const response = await executaPromises(promises);

	console.log('Quantidade de promises: ', allPromises);
	console.log('Quantidade de promises resolvidas: ', resolvedPromises);
	console.log('Quantidade de promises rejeitadas: ', rejectedPromises);
	console.log(response);

	return { response, allPromises, resolvedPromises, rejectedPromises };
}

executar(requests);