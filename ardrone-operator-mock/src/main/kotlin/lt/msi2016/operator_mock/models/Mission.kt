package lt.msi2016.operator_mock.models

data class MissionsResponse(
        val missions: List<MissionPlan>)

data class MissionPlan(
        val missionId: String,
        val submittedBy: String?,
        val state: String?,
        val commands: List<MissionCommands>)


data class MissionCommands(
        val commandType: String, // or create enum ?
        val args: List<String>?)

data class MissionState(
        val status: String, // or create enum ?
        val statusMessage: String = "OK",
        val droneState: MissionDroneState = MissionDroneState(0, 0, 0))

data class MissionDroneState(val x: Int, val y: Int, val z: Int)