// Toggle nearby Neither reactor core block (247) and active TNT block (46,1)

const net = require('net');

var TargetBlock;

var MC = net.createConnection({ port: 4711 }, cb_createConnection);

function cb_createConnection()
{
    MC.setNoDelay(true);

    MC.once('data', cb_getTile);
    MC.write('player.getTile()\n');
}

function cb_getTile(PlayerTile)
{
    let targ = Str2Vec(PlayerTile);
    targ.x--;

    TargetBlock = Vec2str(targ);

    MC.once('data', cb_getBlock);
    MC.write('world.getBlock(' + TargetBlock + ')\n');
}

function cb_getBlock(BlockType)
{
    if (BlockType.toString().trim() === "247")
    {
        MC.write('world.setBlock(' + TargetBlock + ',46,1)\n');
    }
    else if (BlockType.toString().trim() === "46")
    {
        MC.write('world.setBlock(' + TargetBlock + ',247)\n');
    }

    cb_setBlock(TargetBlock);
}

function cb_setBlock(TargetBlock)
{
    MC.once('data', cb_getBlock2);
    MC.write('world.getBlock(' + TargetBlock + ')\n');
}

function cb_getBlock2(BlockType)
{
    console.log('BlockType:  ' + BlockType.toString().trim());

    MC.destroy();
}

// ------------------------------------------------------------------

const Dim_N = [ "x"   , "y"   , "z"   ];
const Dim_S = {  x: 0 ,  y: 1 ,  z: 2 };


function Str2Vec(S)  //   "9,-15,66"  =>  {x:9, y:-15, z:66}
{
    return S
        .toString()
        .trim()
        .split(',')
        .map( v => parseInt(v, 10) )
        .reduce(
                   (a, v, i) =>
                   {
                       a[ Dim_N[i] ] = v; // 0 -> x, 1 -> y, 2 -> z
                       return a;
                   },

                   {}
        );
}

function Vec2str(V)  //   {x:9, y:-15, z:66}  =>  "9,-15,66"
{
    return `${V.x},${V.y},${V.z}`;
}
