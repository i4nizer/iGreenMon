import { z } from "zod";

//

const Esp32CamFormat = [
	"PIXFORMAT_RG656",
	"PIXFORMAT_YUV422",
	"PIXFORMAT_YUV420",
	"PIXFORMAT_GRAYSCALE",
	"PIXFORMAT_JPEG",
	"PIXFORMAT_RGB888",
	"PIXFORMAT_RAW",
	"PIXFORMAT_RGB444",
	"PIXFORMAT_RGB555",
] as const
type Esp32CamFormat = (typeof Esp32CamFormat)[number]

const Esp32CamResolution = [
	"FRAMESIZE_96X96",
	"FRAMESIZE_QQVGA",
	"FRAMESIZE_QCIF",
	"FRAMESIZE_HQVGA",
	"FRAMESIZE_240X240",
	"FRAMESIZE_QVGA",
	"FRAMESIZE_CIF",
	"FRAMESIZE_HVGA",
	"FRAMESIZE_VGA",
	"FRAMESIZE_SVGA",
	"FRAMESIZE_XGA",
	"FRAMESIZE_HD",
	"FRAMESIZE_SXGA",
	"FRAMESIZE_UXGA",
	"FRAMESIZE_FHD",
	"FRAMESIZE_P_HD",
	"FRAMESIZE_P_3MP",
	"FRAMESIZE_QXGA",
	"FRAMESIZE_QHD",
	"FRAMESIZE_WQXGA",
	"FRAMESIZE_P_FHD",
	"FRAMESIZE_QSXGA",
] as const
type Esp32CamResolution = (typeof Esp32CamResolution)[number]

//

const Esp32CamSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1),
    description: z.string(),
    detect: z.boolean(),
    interval: z.number(),
    format: z.enum(Esp32CamFormat),
    quality: z.number().int(),
    resolution: z.enum(Esp32CamResolution),
    realtime: z.boolean(),
    disabled: z.boolean(),
    connected: z.boolean(),
    tokenId: z.number().int(),
    greenhouseId: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

//

const Esp32CamCreateSchema = Esp32CamSchema.pick({
    name: true,
    description: true,
    detect: true,
    interval: true,
    format: true,
    quality: true,
    resolution: true,
    disabled: true,
    greenhouseId: true,
})

const Esp32CamUpdateSchema = Esp32CamSchema.pick({
    id: true,
    name: true,
	description: true,
	detect: true,
	interval: true,
	format: true,
	quality: true,
	resolution: true,
	disabled: true,
})

//

type Esp32Cam = z.infer<typeof Esp32CamSchema>
type Esp32CamCreate = z.infer<typeof Esp32CamCreateSchema>
type Esp32CamUpdate = z.infer<typeof Esp32CamUpdateSchema>

//

export {
    Esp32CamFormat,
    Esp32CamResolution,
    Esp32CamSchema,
    Esp32CamCreateSchema,
    Esp32CamUpdateSchema,
}

export type {
    Esp32Cam,
    Esp32CamCreate,
    Esp32CamUpdate,
}