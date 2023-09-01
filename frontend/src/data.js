import adobe_acrobat_img from './images/adobe_acrobat.png'
import adobe_creative_cloud_img from './images/adobe_creative_cloud.png'
import adobe_illustrator_img from './images/adobe_illustrator.png'
import adobe_photoshop_img from './images/adobe_photoshop.png'
import adobe_animate_img from './images/adobe_animate.png'
import adobe_after_effects_img from './images/adobe_after_effects.png'

const data = {
    products: [
        {
            id: '1', 
            name: 'Adobe Acrobat Pro (1 Year)',
            price: 9,
            description: 'Epic Acrobat',
            detailed_description: `
                Adobe Acrobat Pro is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            image: adobe_acrobat_img, 
            link: '/software-licenses/1'
        },
        {
            id: '2', 
            name: 'Adobe Creative Cloud (1 Year)',
            description: 'Agile like a cloud',
            detailed_description: `
                Adobe Creative Cloud is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            price: 10,
            image: adobe_creative_cloud_img, 
            link: '/software-licenses/2'
        },
        {
            id: '3', 
            name: 'Adobe Illustrator (1 Year)',
            description: 'Illustrate your dreams',
            detailed_description: `
                Adobe Illustrator is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            price: 11,
            image: adobe_illustrator_img, 
            link: '/software-licenses/3'
        },
        {
            id: '4', 
            name: 'Adobe Photoshop (1 Year)',
            description: 'Edit your photos like a pro',
            detailed_description: `
                Adobe Photoshop is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            price: 12,
            image: adobe_photoshop_img, 
            link: '/software-licenses/4'
        },
        {
            id: '5', 
            name: 'Adobe Animate (1 Year)',
            description: 'Dream and animate',
            detailed_description: `
                Adobe Animate is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            price: 13,
            image: adobe_animate_img, 
            link: '/software-licenses/5'
        },
        {
            id: '6', 
            name: 'Adobe After Effects (1 Year)',
            description: 'Cool effects',
            detailed_description: `
                Adobe After Effects is a really super awesome cool
                software that can help you with your business 
                needs! acdefghijk
            `,
            price: 14,
            image: adobe_after_effects_img, 
            link: '/software-licenses/6'
        },
    ],
};

export default data; 