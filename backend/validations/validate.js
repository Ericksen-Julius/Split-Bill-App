export default function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,   // Joi cek semua error sekaligus, bukan berhenti di error pertama
            stripUnknown: true   // buang field asing yang tidak ada di schema
        });

        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map(d => d.message) // kirim daftar pesan error
            });
        }

        req.body = value; // replace req.body dengan hasil yang sudah divalidasi & "dibersihkan"
        next();           // lanjut ke controller
    };
}
