package lt.msi2016.operator_mock.models


data class MissionPlan(
        val missionId: String,
        val commands: List<MissionCommands>)


data class MissionCommands(
        val commandType: String, // or create enum ?
        val args: List<String>? = listOf())

data class MissionState(
        val status: String, // or create enum ?
        val statusMessage: String = "OK",
        val droneState: MissionDroneState = MissionDroneState(0, 0, 0))

data class MissionDroneState(val x: Int, val y: Int, val z: Int)