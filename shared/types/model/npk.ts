
//

const NPKModelClass = [
	"Healthy",
	"Nitrogen Deficient",
	"Phosphorus Deficient",
	"Potassium Deficient",
] as const
type NPKModelClass = (typeof NPKModelClass)[number]

const NPKModelClassColor = [
	{ class: NPKModelClass[0], color: "#4CAF50" },
	{ class: NPKModelClass[1], color: "#FFEB3B" },
	{ class: NPKModelClass[2], color: "#673AB7" },
	{ class: NPKModelClass[3], color: "#795548" },
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