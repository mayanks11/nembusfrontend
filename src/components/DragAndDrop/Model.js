import { DefaultNodeModel } from '@projectstorm/react-diagrams';

export default class Model extends DefaultNodeModel {
  constructor(props) {

    console.log("INSIDE MODEL ---------------->",props)
    super({
      ...props,
      type: 'deltav'
    });
  }

  

  // getOptions() {
  //   return this.options;
  // }

  // setOptions(data) {
  //   this.options = data;
  // }

  getID() {
    return this.options.id;
  }
}
