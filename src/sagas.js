import { take, put, fork, race, call, delay } from "redux-saga/effects";
import actionCreators, { COMMIT_SPIN, RANDOMIZE } from "./actions";

const randomNumber = 35;

function* randomlySpin() {
  // Randomly select an axis and direction, rotating cube
  const axes = ["x", "y", "z"];
  const axis = axes[Math.floor(Math.random() * 3)];
  const direction = Boolean(Math.round(Math.random()));
  yield put(actionCreators.rotateCube(axis, direction));
}

function* randomizeCube() {
  // Perform random spinSlice 35 times to shuffle cube
  let lastSlice = null;
  for (let i = 0; i < randomNumber; i++) {
    if (i % 4 === 0) yield fork(randomlySpin);

    let slice = lastSlice;
    while (slice === lastSlice) {
      slice = Math.floor(Math.random() * 9);
    }
    const direction = Boolean(Math.round(Math.random()));
    yield put(actionCreators.spinSlice(slice, direction));
    yield race({
      nextSpin: take(COMMIT_SPIN),
      timeout: call(delay, 200),
    });
  }
  yield put(actionCreators.endRandomize());
}

function* watchRandomize() {
  while (yield take(RANDOMIZE)) {
    yield fork(randomizeCube);
  }
}

export default function* () {
  yield [fork(watchRandomize)];
}
