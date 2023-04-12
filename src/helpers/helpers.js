/**
 * Helpers Functions
 */
import moment from 'moment';
import { fireStore, auth } from '../firebase';
import { NotificationManager } from 'react-notifications';
import { EXTRA_DATA__SET_USER_DATA } from '../actions/types';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
    return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
*/
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}

/**
 * Get current user document
 */

export async function getCurrentUserData(dispatch, getState) {
    // Check if data already exist in Redux state
    if (
        getState().extraData.user.userData &&
        getState().extraData.user.userInfoDocument
    ) {
        // Return data from redux state
        return {
            userData: getState().extraData.user.userData,
            userInfo: getState().extraData.user.userInfoDocument
        };
    } else {
        // Get user data & save in redux state
        const userInfo = await fireStore
            .collection('users')
            .doc(auth.currentUser.uid)
            .get();
        const userData = userInfo.data();
        dispatch({
            type: EXTRA_DATA__SET_USER_DATA,
            data: { userData, userInfoDocument: userInfo }
        });
        return { userData, userInfo };
    }
}

/**
 * Check if user with email ID exist in users collection
 */
export async function isUserWithEmailExist(email, setSubmitting) {
    let userByEmail;
    let result = false;
    {
        // Check if any user exist with the email ID
        userByEmail = await fireStore
            .collection('users')
            .where('Email', '==', email)
            .get();
        if (userByEmail.empty) {
            NotificationManager.error(
                `There is no user with Email ID '${email}'`
            );
            setSubmitting(false);
            result = true;
        }
    }
    const userByEmailData = userByEmail.docs[0];
    return { userByEmail, userByEmailData, result };
}

export function isSameDay(d1, d2) {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}
