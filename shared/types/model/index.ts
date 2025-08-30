import {
	NPKModelClass,
	NPKModelClassColor,
	NPKModelInputSize,
} from "./npk"

//

interface ODModel {
	class: readonly string[]
	color: readonly { class: string; color: string }[]
	input: readonly [number, number]
}

//

const ODModel = [
	{
		class: NPKModelClass,
		color: NPKModelClassColor,
		input: NPKModelInputSize,
	},
] as const

//

export * from "./npk"
export { ODModel }
