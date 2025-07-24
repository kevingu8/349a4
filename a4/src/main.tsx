import { render } from "preact";
import { Model } from "./model";
import { MainView } from "./views/mainView";

const model = new Model();
const root = document.querySelector("div#app")!;

render(<MainView model={model} />, root);
