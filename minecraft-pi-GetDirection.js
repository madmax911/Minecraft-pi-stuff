// Determine direction you are facing in minecraft-pi
// with respect to the Neither reactor core (247) you are facing.

const net = require('net');

var PlayerTile;
var TargetBlock;
var PlayerDirection;

var MC = net.createConnection({ port: 4711 }, cb_createConnection);

function cb_createConnection()
{
    MC.once('data', cb_getTile);
    MC.write('player.getTile()\n');
}

function cb_getTile(ptile)
{
    PlayerTile = ptile;
    let targ = Str2Vec(PlayerTile);
    targ.z++; // north

    TargetBlock = Vec2str(targ);

    MC.once('data', cb_North);
    MC.write('world.getBlock(' + TargetBlock + ')\n');
}

function cb_North(BlockType)
{
    if (BlockType.toString().trim() === "247")
    {
        cb_Final("N")
    }
    else
    {
        let targ = Str2Vec(PlayerTile);
        targ.x--; // east

        TargetBlock = Vec2str(targ);

        MC.once('data', cb_East);
        MC.write('world.getBlock(' + TargetBlock + ')\n');
    }
}

function cb_East(BlockType)
{
    if (BlockType.toString().trim() === "247")
    {
        cb_Final("E")
    }
    else
    {
        let targ = Str2Vec(PlayerTile);
        targ.z--; // south

        TargetBlock = Vec2str(targ);

        MC.once('data', cb_South);
        MC.write('world.getBlock(' + TargetBlock + ')\n');
    }
}

function cb_South(BlockType)
{
    if (BlockType.toString().trim() === "247")
    {
        cb_Final("S")
    }
    else
    {
        let targ = Str2Vec(PlayerTile);
        targ.x++; // west

        TargetBlock = Vec2str(targ);

        MC.once('data', cb_West);
        MC.write('world.getBlock(' + TargetBlock + ')\n');
    }
}

function cb_West(BlockType)
{
    if (BlockType.toString().trim() === "247")
    {
        cb_Final("W")
    }
    else
    {
        cb_Final("?")
    }
}



function cb_Final(dir)
{
    console.log('Direction:  ' + dir);

    MC.destroy();
}

// ---------------------------------------------------------------

function Str2Vec(S)  //   "9,-15,66"  =>  {x:9, y:-15, z:66}
{
    return S
        .toString()
        .trim()
        .split(',')
        .map(v => parseInt(v, 10))
        .reduce(
                   (a,v,i) =>
                   {
                       a[Dim_N[i]] = v;
                       return a;
                   },

                   {}
        );
}

function Vec2str(V)  //   {x:9, y:-15, z:66}  =>  "9,-15,66"
{
    return `${V.x},${V.y},${V.z}`;
}

const Dim_N = [ "x"   , "y"   , "z"   ];
const Dim_S = {  x: 0 ,  y: 1 ,  z: 2 };