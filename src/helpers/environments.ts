import * as dotenv from "dotenv";
dotenv.config();

const environments = {
	APP_NAME: process.env.APP_NAME ?? "",
	PORT: process.env.PORT,
	MONGO_DB_URL: process.env.MONGO_DB_URL ?? "",
	APP_DESC_SWAGGER: process.env.APP_DESC_SWAGGER ?? "",
	MONGO_DB: process.env.MONGO_DB ?? "",
	APP_VERSION: process.env.APP_VERSION ?? "",
	JWT_SECRET: process.env.JWT_SECRET ?? "",
	JWT_EXPIRE: process.env.JWT_EXPIRE ?? "",
	IMAGE_KIT_PUB_KEY: process.env.IMAGE_KIT_PUB_KEY ?? "",
	IMAGE_KIT_PRV_KEY: process.env.IMAGE_KIT_PRV_KEY ?? "",
	IMAGE_KIT_URL_ENDPOINT: process.env.IMAGE_KIT_URL_ENDPOINT ?? "",
};

export default environments;
