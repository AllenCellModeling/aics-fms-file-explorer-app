import { expect } from "chai";

import { SELECT_DISPLAY_ANNOTATION } from "../../selection/actions";
import createMockReduxStore from "../../test/mock-redux-store";

import { RECEIVE_ANNOTATIONS, requestAnnotations } from "../actions";

describe("Metadata logics", () => {
    describe("requestAnnotations", () => {
        it("Fires RECEIVE_ANNOTATIONS action after processing REQUEST_ANNOTATIONS action", async () => {
            // setup
            const [store, logicMiddleware, actions] = createMockReduxStore();

            // do
            store.dispatch(requestAnnotations());
            await logicMiddleware.whenComplete();

            // assert
            expect(actions.includesMatch({ type: RECEIVE_ANNOTATIONS })).to.equal(true);
            expect(actions.includesMatch({ type: SELECT_DISPLAY_ANNOTATION })).to.equal(true);
        });
    });
});