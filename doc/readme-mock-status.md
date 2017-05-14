# HTTP status code in mock data
You can change the HTTP response code of the mock by setting the `_status` parameter in your mock.

This is especially useful when combined with [mock functions](/doc/readme-mock-functions.md) to dynamically set the response status code. 

Example:
```json
{
  "success": false,
  "_status": 400
}
```

The HTTP status code will be 400 the response will be:
```json
{
  "success": false
}
```
