import { UserDocument } from "@/user/user.schema";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Tracker, TrackerDocument } from "./tracker.schema";
@Injectable()
export class TrackerService {
	constructor(
		@Inject(REQUEST) private readonly request: { user: UserDocument },
		@InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
	) {}
}
