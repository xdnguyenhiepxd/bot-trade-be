import { JwtStrategy } from "@/user/guards/jwt.strategy";
import { User, UserSchema } from "@/user/user.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TrackerService } from "./book.service";
import { TrackerController } from "./tracker.controller";
import { Tracker, TrackerSchema } from "./tracker.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Tracker.name, schema: TrackerSchema }]),
	],
	controllers: [TrackerController],
	providers: [TrackerService, JwtStrategy],
	exports: [TrackerService],
})
export class TrackerModule {}
