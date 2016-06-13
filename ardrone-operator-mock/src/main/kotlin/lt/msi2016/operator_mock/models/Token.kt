package lt.msi2016.operator_mock.models


data class TokenRequest(val controlHostname: String, val accessToken: String)

data class TokenResponse(val operationId: String)