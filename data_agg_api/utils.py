from rest_framework.response import Response

#check to see if there is a required parameters for creating
#a database object
def check_for_key(request_data, key_list):
	for key in key_list:
		try:
			val = request_data[key]
		except KeyError:
			return Response('You dont have the params `{0}`'.format(key))
