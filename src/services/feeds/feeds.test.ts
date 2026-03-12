import {
    initialState,
    getFeeds,
    feedSlice,
    FeedsState
} from './feeds';

const testFeeds: FeedsState = {
    isLoading: false,
    orders: [
        {
            _id: '123',
            status: 'WIP',
            name: 'Beef only',
            createdAt: '',
            updatedAt: '',
            number: 1,
            ingredients: ['beef']
        },
        {
            _id: '123',
            status: 'READY',
            name: 'VEGAN VIBE',
            createdAt: '',
            updatedAt: '',
            number: 2,
            ingredients: ['bun', 'lettuce']
        }
    ],
    feed: {
        total: 100,
        totalToday: 5
    },
    error: null
};

describe('TEST', () => {
    const reducer = feedSlice.reducer;

    test('TEST', () => {
        const next = reducer(undefined, { type: 'TEST' });
        expect(next).toEqual(initialState);
        console.debug('test')
    });
});
