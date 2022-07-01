import slugify from 'slugify'

const slug = (string: string, sufix: string | number) => slugify(string, { strict: true, }) + '-' + sufix

export default slug
