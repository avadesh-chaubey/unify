import mongoose from 'mongoose';

interface CounterAttrs {
    _id: string;
    sequence_value: number;
}

interface CounterDoc extends mongoose.Document {
    _id: string;
    sequence_value: number;
}

interface CounterModel extends mongoose.Model<CounterDoc> {
    build(attrs: CounterAttrs): CounterDoc;
    findByEvent(event: {
        id: string;
    }): Promise<CounterDoc | null>;
}

const counterSchema = new mongoose.Schema(
    {
        sequence_value: {
            type: Number,
            default: 1
        },
        _id: {
            type: String,
            required: true,
            default: 'arhorderId'
        }
    }
);

counterSchema.static('build', (attrs: CounterAttrs) => {
    return new Counter(attrs);
});

const Counter = mongoose.model<CounterDoc, CounterModel>('Counter', counterSchema);

export { Counter };
