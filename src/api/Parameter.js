import { fireStore } from '../firebase';
import {
    string,
    object,
    number
} from 'yup';

const parameterSchema = object().shape({
    project: string(),
    case: string(),
    initPosition: object().shape({
        X: number().required(),
        Y: number().required(),
        Z: number().required(),
        XU: string().required(),
        YU: string().required(),
        ZU: string().required()
    }),
    velocity: object().shape({
        X: number().required(),
        Y: number().required(),
        Z: number().required(),
        XU: string().required(),
        YU: string().required(),
        ZU: string().required()
    }),
}).noUnknown();

class Parameter {
    static async create(data) {
        // console.log('create : ', data);
    }
}

export default Parameter;