const Kavenegar = require('kavenegar');
const apiKey = process.env.API_KEY_KAVEH;
const api = Kavenegar.KavenegarApi({
    apikey: apiKey
});
exports.sendSMS = async function(receptorNumber , usercode) {
    try {
        api.Send({
            message: `${usercode} باتشکر از ثبت نام شما در باشگاه تکنسین های باشگاه شیلان پس از تایید ثبت نام شما مبلغ دو میلیون ریال به کیف پول شما واریز خواهد شد. کد شما : `,
            sender: "0018018949161",
            receptor: receptorNumber
        }, function(response, status) {
            console.log("Response:", response);
            console.log("Status:", status);
        });
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};

