import Cookies from 'js-cookie';

var TEMPERATURE_URL = '/api/temperatures/';

export default class API{

    static query(url, query_params) {
		if (query_params === undefined)
			return url;
		else if (Object.keys(query_params).length == 0)
			return url;
		else {
			url += "?";
			var query_url = []
			Object.keys(query_params).forEach((key, index) => {
				if (query_params[key].toString() != '')
					query_url.push(key + "=" + query_params[key].toString());
			});
			query_url = query_url.join('&');
			return url + query_url;
		}
	}

    static get_temperatures(query_params) {
        var url = this.query(TEMPERATURE_URL, query_params);
        var headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

        return fetch(url, { headers: headers })
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    return data;
                });
    }

    static create_temperatures(temp_data){
        var csrftoken = Cookies.get('csrftoken');
		var headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');
		headers.append('X-CSRFToken', csrftoken);

        return fetch(TEMPERATURE_URL, {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
				'temp': temp_data.temp,
                'time': temp_data.time,
                'date': temp_data.date
				})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            return data;
        })
    }

    static upload_temperatures(file){
        var csrftoken = Cookies.get('csrftoken');
		var headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('X-CSRFToken', csrftoken);

        const formData = new FormData();
        formData.append('data_file', file);

        return fetch(TEMPERATURE_URL + 'upload/', {
            method: 'post',
            headers: headers,
            body: formData,
        }).then((res) => {
            return res.json();
        }).then((data) => {
            return data;
        })


    }
}
