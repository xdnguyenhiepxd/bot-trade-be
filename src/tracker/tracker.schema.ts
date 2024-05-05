import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TrackerDocument = HydratedDocument<Tracker>;

@Schema()
export class Tracker {
	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	bookId: string;

	@Prop({ required: true, default: Date.now() })
	lastVisit: number;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
