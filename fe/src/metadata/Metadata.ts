interface Metadata{
    name: string;
    image:string;
    properties:{
    artist: string;
    timestamp: Date;};

}
export interface MetaDataIndexed extends Metadata{
    token_id: number;
}
export default Metadata;