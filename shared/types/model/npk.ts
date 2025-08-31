
//

const NPKModelClass = [
	"Healthy",
	"Nitrogen Deficient",
	"Phosphorus Deficient",
	"Potassium Deficient",
] as const
type NPKModelClass = (typeof NPKModelClass)[number]

const NPKModelClassColor = [
	{ class: NPKModelClass[0], color: "#4CAF50", background: "#1B5E20" },
	{ class: NPKModelClass[1], color: "#FFEB3B", background: "#212121" },
	{ class: NPKModelClass[2], color: "#673AB7", background: "#D1C4E9" },
	{ class: NPKModelClass[3], color: "#795548", background: "#EFEBE9" },
] as const
type NPKModelClassColor = (typeof NPKModelClassColor)[number]

//

const NPKModelInputSize = [320, 320] as const
type NPKModelInputSize = (typeof NPKModelInputSize)[number]

//

export {
	NPKModelClass,
	NPKModelClassColor,
	NPKModelInputSize,
}