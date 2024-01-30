const Testimonial = require('../Model/TestimonialModel')
const Service = require('../Model/ServiceModel')

const getTestimonial = async (req, res) => {
    const testimonialData = await Testimonial.find().populate("serviceId")
    res.render("testimonial", {
        title: "testimonialpage",
        result: testimonialData,
        data: req.admin
    });
}

const addTestimonial = async (req, res) => {
    const result = await Service.find()
    res.render("addTestimonial", {
        title: "addtestimonialpage",
        response: result,
        data: req.admin
    });
}

const postTestimonial = async (req, res) => {
    try {
        const Testimonialdata = new Testimonial({
            serviceId: req.body.serviceId,
            client_name: req.body.client_name,
            review: req.body.review,
            image: req.file.path
        });
        await Testimonialdata.save();
        res.redirect("/admin/testimonial")
    }
    catch (error) {
        console.log(error);
        req.flash("message", "Error!");
        res.redirect("/admin/getaddTestimonial")
    }
}

const getEditTestimonial = async (req, res) => {
    try {
        const id = req.params.id;

        const testimonialData = await Testimonial.findById(id);

        const serviceData = await Service.find();

        // console.log(serviceData, trainersData);

        res.render('editTestimonial', {
            title: "editpage",
            responseData: {
                testimonial: testimonialData,
                service: serviceData
            },
            data: req.admin
        });
    } catch (err) {
        console.error(err);
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const id = req.body.testimonial_id;

        const testimonial = await Testimonial.findById(id);
        testimonial.serviceId = req.body.serviceId;
        testimonial.client_name = req.body.client_name;
        testimonial.review = req.body.review;
        if (req.file) {
            service.image = req.file.path;
        }
        const service = await Service.findById(req.body.serviceId);
        testimonial.service_name = service.service_name;

        const updatedTestimonial = await testimonial.save();
        // console.log(updatedTestimonial, "update successfully");
        res.redirect('/admin/testimonial');
    } catch (err) {
        console.log(err, "update failed-");
    }
};

const testimonialDelete = (req, res) => {
    Testimonial.deleteOne({ _id: req.params.id }).then((del) => {
        res.redirect('/admin/testimonial')
    }).catch((err) => {
        console.log(err, "delete failed")
    })
}

const testimonialActivate = (req, res) => {
    const id = req.params.id
    Testimonial.findById(id).then((data) => {
        data.status = '0'
        return data.save().then(result => {
            res.redirect('/admin/testimonial')
            console.log(result, "Testimonial activated successfully")
        })
    }).catch(err => {
        console.log(err, "activation failed")
    })
}
const testimonialDeactivate = (req, res) => {
    const id = req.params.id
    Testimonial.findById(id).then((data) => {
        data.status = '1'
        return data.save().then(result => {
            res.redirect('/admin/testimonial')
            console.log(result, "Testimonial activated successfully")
        })
    }).catch(err => {
        console.log(err, "activation failed")
    })
}

module.exports = {
    getTestimonial,
    addTestimonial,
    postTestimonial,
    getEditTestimonial,
    updateTestimonial,
    testimonialDelete,
    testimonialActivate,
    testimonialDeactivate
}