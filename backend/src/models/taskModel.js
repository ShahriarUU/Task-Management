import mongoose from "mongoose";

const taskSchema = new taskSchema(
    {
        title: {
            type: String,
            required: [true, "task title is required"]
        },

        description: {
            type: String,
            required: [true, "task description is required"]
        },
        date: {
            type: Date,
            default: new Date()
        },
        priority: {
            type: String,
            default: "normal",
            enum: ["high", "medium", "normal", "low"],
        },

        stage: {
            type: String,
            default: "todo",
            enum: ["todo", "in progress", "completed"],
        },

        activities: [
            {
                type: {
                    type: String,
                    default: "assigned",
                    enum: [
                        "assigned",
                        "started",
                        "in progress",
                        "bug",
                        "completed",
                        "commented",
                    ],
                },
                activity: String,
                date: {
                    type: Date,
                    default: new Date()
                },
                by: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
            },
        ],

        assets: [String],
        team: [{ type: Schema.Types.ObjectId, ref: "User" }],

    }, { timestamps: true }
)

export default Task = mongoose.model("Task", "taskSchema");