import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import { authenticationActions } from "../redux/slices/authenticationSlice";
import { useSelector } from "react-redux";

const STEAM_API_KEY = "F9B6127DDEB6AF27EA0D64F1E5C642A4";

export const steamAPIService = {
	useSteamAuthService: () => {
		useEffect(() => {
			if (window.location.href.includes("openid")) {
				const search = window.location.search.substring(1);

				const urlObj = JSON.parse(
					'{"' +
						decodeURI(search)
							.replace(/"/g, '\\"')
							.replace(/&/g, '","')
							.replace(/=/g, '":"') +
						'"}'
				);

				const getUserId = (response) => {
					const str = response["openid.claimed_id"];
					const res = decodeURIComponent(str);
					const propsArr = res.split("/");
					console.log(propsArr);

					return propsArr[propsArr.length - 1];
				};

				const userId = getUserId(urlObj);
				userId && appStore.dispatch(authenticationActions.setUserID(userId));
				window.location.href = "/";
			}
		}, []);
	},
	useUserDataFetcher: () => {
		const userID = useSelector(
			(state: AppState) => state.authenticationReducer.userID
		);

		useEffect(() => {
			if (userID) {
				const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${userID}`;
				fetch(fetchURL, {
					method: "GET",
					headers: {
						accept:
							"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
					},
					mode: "no-cors",
				}).then((response) => {
					console.log(response);
				});
			}
		}, [userID]);
	},
};