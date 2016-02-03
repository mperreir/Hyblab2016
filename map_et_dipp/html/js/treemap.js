'use strict';

var margin = {top: 30, right: 0, bottom: 20, left: 0},
    //width = 960,
    width = (window.screen.availWidth * 57.6/100),
    //height = 500 - margin.top - margin.bottom,
    height = (window.screen.availHeight * 40/100) - margin.top - margin.bottom,
    transitioning;

// sets x and y scale to determine size of visible boxes
var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var colorSet = { 'JF' : '#38615a', // Jardin Familial
                 'JP' : '#389d6e', // Jardin Partagé
                 'JI': '#62ceb3', // Jardin d'Insertion
                 'SG' : '#ffffff' // Station Gourmande
               };

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d._children; }) // Fonction d'accès aux noeuds fils
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select('#treemap').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
    .style('margin-left', -margin.left + 'px')
    .style('margin.right', -margin.right + 'px')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .style('shape-rendering', 'crispEdges');


// Ajout d'une balise 'grandparent' permettant au clic de dézoomer le treemap.
var grandparent = svg.append('g')
    .attr('class', 'grandparent');

grandparent.append('rect')
    .attr('y', -margin.top)
    .attr('width', width)
    .attr('height', margin.top)
    .attr('stroke', '#90D7DF')
    .attr('stroke-width', '2px');

grandparent.append('text')
    .attr('x', 6)
    .attr('y', 6 - margin.top)
    .attr('dy', '.75em')
    .attr('font-weight', 'bold');



function initialize(root) {
  root.x = root.y = 0;
  root.dx = width;
  root.dy = height;
  root.depth = 0;
}

// Aggregate the values for internal nodes. This is normally done by the
// treemap layout, but not here because of our custom implementation.
// We also take a snapshot of the original children (_children) to avoid
// the children being overwritten when when layout is computed.
function accumulate(d) {
  return (d._children = d.children)
    // recursion step, note that p and v are defined by reduce
      ? d.value = d.children.reduce(function(p, v) {return p + accumulate(v); }, 0)
      : d.value;
}

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
function layout(d) {
  if (d._children) {
    // treemap nodes comes from the treemap set of functions as part of d3
    treemap.nodes({_children: d._children});
    d._children.forEach(function(c) {
      c.x = d.x + c.x * d.dx;
      c.y = d.y + c.y * d.dy;
      c.dx *= d.dx;
      c.dy *= d.dy;
      c.parent = d;

      layout(c);
    });
  }
}

d3.json('json/treemap.json', function(root) {
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  function display(d) {
    grandparent // Ajout de la transition au clic et du texte contenu dans la balise 'grandparent'.
        .datum(d.parent)
        .on('click', transition)
      .select('text')
        .text(name(d))
        .attr('fill', '#fff');

    grandparent // Ajout de la couleur de la balise 'grandparent'
        .datum(d.parent)
      .select('rect')
        .attr('fill', '#585858');

    var g1 = svg.insert('g', '.grandparent') // Insère une balise 'g' de classe 'depth' avant la balise 'grandparent'.
         .datum(d)
        .attr('class', 'depth');

    var g = g1.selectAll('g') // Insère dans la balise 'depth' une balise 'g' pour chaque enfant de d.
        .data(d._children)
      .enter().append('g');


    // On attribut la classe 'children', et une transition au clic, pour chacune des précédentes balises 'g'
    g.filter(function(d) { return d._children; })
        .classed('children', true)
        .on('click', transition); // On pourrait ajouter la propriété CSS OnHover.

    g.selectAll('.child')
        .data(function(d) { return d._children || [d]; })
      .enter().append('rect')
        .attr('class', 'child')
        .call(rect);
    
    g.append('rect')
      .attr('class', 'parent')
      .call(rect);

    g.append('text')
        .attr('dy', '.75em')
        .text(function(d) { return d.name; })
        .call(text);

    if (d.value == 1) {

      if (d._children[0].address) {
        g.append('text')
          .attr('dy', '2em')
          .text(function(d) { return 'Adresse : ' + d.address; })
          .call(text);
      }

      if (d._children[0].city) {
        g.append('text')
          .attr('dy', '3.25em')
          .text(function(d) { return 'Ville : ' + d.city; })
          .call(text);
      }

      if (d._children[0].type) {
        g.append('text')
          .attr('dy', '4.5em')
          .text(function(d) { return 'Type : ' + d.type; })
          .call(text);
      }

      if (d._children[0].plot) {
        g.append('text')
          .attr('dy', '5.75em')
          .text(function(d) { return 'Nombre de parcelles : ' + d.plot; })
          .call(text);
      }

      if (d._children[0].totalsize) {
        g.append('text')
          .attr('dy', '7em')
          .text(function(d) { return 'Surface totale (m²) : ' + d.totalsize; })
          .call(text);
      }
    }
    else
    {
      /*
      g.append('text')
        .attr('x', function(d) { return x(d.x) + 6; })
        .attr('y', function(d) { return y(d.y) + 6; })
        .text(function(d) { return d.value; })
        .attr('font-size', '2em')
        .attr('fill', function (d) { return (d.major == 'SG') ? '#3f6660' : '#fff'; });
      */
    }

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style('shape-rendering', null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll('.depth').sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll('text').style('fill-opacity', 0);

      // Transition to the new view.
      t1.selectAll('text').call(text).style('fill-opacity', 0);
      t2.selectAll('text').call(text).style('fill-opacity', 1);
      t1.selectAll('rect').call(rect);
      t2.selectAll('rect').call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each('end', function() {
        svg.style('shape-rendering', 'crispEdges');
        transitioning = false;
      });
    }

    return g;
  }

  
  function text(text) {
    text.attr('x', function(d) { return x(d.x) + 6; })
        .attr('y', function(d) { return y(d.y) + 6; })
        .attr('fill', function (d) { return (d.major == 'SG') ? '#3f6660' : '#fff'; });
  }

  function rect(rect) {
    rect.attr('x', function(d) { return x(d.x); })
        .attr('y', function(d) { return y(d.y); })
        .attr('width', function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr('height', function(d) { return y(d.y + d.dy) - y(d.y); })
        .attr('stroke', '#90D7DF')
        .attr('stroke-width', '1px')
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', function(d){ return colorSet[d.major]; });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + ' > ' + d.name
        : d.name;
  }

});