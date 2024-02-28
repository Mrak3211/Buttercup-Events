import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const sendEmail = (
	name,
	email,
	title,
	time,
	date,
	note,
	description,
	passcode,
	flier_url,
	setSuccess,
	setLoading
) => {
	emailjs
		.send(
			process.env.NEXT_PUBLIC_SERVICE_ID,
			process.env.NEXT_PUBLIC_TEMPLATE_ID,
			{
				name,
				email,
				title,
				time: convertTo12HourFormat(time),
				date,
				note,
				description,
				passcode,
				flier_url,
			},
			process.env.NEXT_PUBLIC_API_KEY
		)
		.then(
			(result) => {
				setLoading(false);
				setSuccess(true);
			},
			(error) => {
				alert(error.text);
			}
		);
};

export const generateID = () => Math.random().toString(36).substring(2, 10);
export const createSlug = (sentence) => {
	let slug = sentence.toLowerCase().trim();
	slug = slug.replace(/[^a-z0-9]+/g, "-");
	slug = slug.replace(/^-+|-+$/g, "");
	return slug;
};

export const successMessage = (message) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};
export const errorMessage = (message) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const convertTo12HourFormat = (time) => {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "pm" : "am";
	const hours12 = hours % 12 || 12;
	const formattedTime = `${hours12.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}`;
	return `${formattedTime}${period}`;
};

export const updateRegLink = async (id) => {
	const number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	const eventRef = doc(db, "events", id);
	updateDoc(eventRef, {
		disableRegistration: true,
		slug: `expired-${number}`,
	});
};