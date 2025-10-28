# Code Citations

## License: unknown
https://github.com/acmvnrvjiet/Automated-Mailing-Script/tree/d52ab19c3d7288e76f023d71efde454f24691a34/Automated%20Mailer.py

```
if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file('credentials
```


## License: unknown
https://github.com/poojanvig/email/tree/ebea5326fc45a7c6dffa12b8bdd7960c1f8cf45a/main.py

```
from_client_secrets_file('credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return build('calendar', 'v3',
```

