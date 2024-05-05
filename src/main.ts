import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import environments from "./helpers/environments";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({ origin: "*" });
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle(environments.APP_NAME)
		.setDescription(environments.APP_DESC_SWAGGER)
		.setVersion(environments.APP_VERSION)
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	await app.listen(environments.PORT || 4000);
}
bootstrap();
