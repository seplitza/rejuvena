/**
 * API Endpoints
 * Ported from mobile app
 */

// General
export const get_general_settings = '/generalsetting/getgeneralsetting';

// Auth
export const register = '/user/register';
export const login = '/api/auth/login'; // Unified auth with Azure fallback
export const reset_password = '/api/auth/reset-password';
export const login_google = '/token/login-with-gmail';
export const login_facebook = '/token/login-with-facebook';
export const login_apple = '/token/login-with-apple';
export const guest_user_login = '/token/GuestUserLogin';

// Order
export const get_order_list = '/order/getuserorders';
export const get_current_marathon = 'order/checkformarathonpurchased';
export const purchase_marathon_by_coupon = '/order/purchasemarathon';

// User
// Profile
export const get_user_profile = '/api/auth/me';
// export const update_user_profile = '/user/updateprofile';
export const change_password = '/api/auth/change-password';
export const delete_account = '/User/DeleteAccount';

// User Exercise
export const get_start_marathon = '/usermarathon/startmarathon';
export const accept_marathon_terms = '/usermarathon/acceptcourserules';
export const get_day_exercises = '/usermarathon/getdayexercise';
export const change_exercise_status = '/usermarathon/setuserexercisestatus';
export const get_comments = '/usermarathon/getcomments';
export const get_child_comments = '/usermarathon/getchildcomments';
export const post_comment = '/usermarathon/createcomment';
export const like_comment = '/marathon/likecomment';
export const get_course_detail = '/Marathon/ExtensionDescription';
export const updateDayStarValue = '/usermarathon/UpdateDayStarValue';

// Photo Diary
export const get_contest = '/contest/getcontest';
export const get_voting_contest = '/contest/GetContestGuestUser';
export const get_contest_images = '/contest/getusercontestimages';
export const upload_contest_image = '/contest/uploadcontestimages';
export const upload_contest_image_mask = '/contest/uploadusermaskimages';
export const confirm_contest_image = '/contest/confirmcontestmaskimages';
export const take_part_in_contest = '/contest/takepartincontest';
export const accept_contest_rules = '/contest/acceptcontestrules';
export const download_collage_image = '/contest/downloadcollageimageforuser';
export const download_collage_pdf = '/contest/downloadcollageimageforuserpdf';
export const set_record_before_photo_upload = '/contest/setuserrecordbeforephotoupload';
export const get_record_before_photo_upload = '/contest/getuserrecordbeforephotoupload';

// Notification
export const get_notifications = '/notification/getnotifications';
export const mark_notification_read = '/notification/marknotificationasread';
export const get_notification_count = '/notification/getnotificationcount';

// Feedback
export const send_feedback = '/feedback/sendfeedback';
export const send_bug_report = '/feedback/sendbugreport';

// Marathon / Courses
export const get_marathons_guest_user = '/marathon/GetMarathonsGuestUser';
export const get_demo_course_list = '/marathon/GetDemoCourseList';
export const get_course_plan = '/marathon/getcourseplan';
export const create_order = '/Order/CreateOrder';

// New Marathon API
export const get_marathon_day = (marathonId: string, dayNumber: string) => `/api/marathons/${marathonId}/day/${dayNumber}`;

// Payment
export const payment_create = '/api/payment/create';
export const payment_history = '/api/payment/history';
export const payment_status = '/api/payment/status';
