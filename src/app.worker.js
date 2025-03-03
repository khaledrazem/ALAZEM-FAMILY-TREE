import { tree as d3tree, hierarchy } from 'd3-hierarchy';  // ✅ Import only what you need
import { extent } from 'd3';  // ✅ Import only what you need





    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        let { data, main_id, node_separation, level_separation, single_parent_empty_card, is_horizontal} = e.data;
  
        
        console.log(1)
        if (is_horizontal) [node_separation, level_separation] = [level_separation, node_separation];
    
        const data_stash = single_parent_empty_card ? createRelsToAdd(data) : data;
        sortChildrenWithSpouses(data_stash);
    
        const main = (main_id !== null && data_stash.has(main_id)) ? data_stash.get(main_id) : data_stash.values().next().value;
        const tree_children = calculateTreePositions(main, 'children', false);
        const tree_parents = calculateTreePositions(main, 'parents', true);
        console.log(2)
  
        for (const d of data_stash.values()) d.main = d.id === main.id;
  
        levelOutEachSide(tree_parents, tree_children);
        const tree = mergeSides(tree_parents, tree_children);
        console.log(3)
  
        //setupChildrenAndParents({tree});
        console.log(4)
  
        setupSpouses({tree, node_separation});
        console.log(5)
  
        setupProgenyParentsPos({tree});
        console.log(6)
  
        nodePositioning({tree});
        console.log(7)
  
        for (const d of tree) d.all_rels_displayed = isAllRelativeDisplayed(d, tree);
        console.log(7.5)
  
        const dim = calculateTreeDim(tree, node_separation, level_separation);
        console.log(8)
        postMessage({data: tree, data_stash, dim, main_id: main.id, is_horizontal});
    
        function calculateTreePositions(datum, rt, is_ancestry) {
            const hierarchyGetter = rt === "children" ? hierarchyGetterChildren : hierarchyGetterParents;
            const d3_tree = d3tree().nodeSize([node_separation, level_separation]).separation(separation);
            const root = hierarchy(datum, hierarchyGetter);
            d3_tree(root);
            
            return root.descendants();
    
            function separation(a, b) {
                let offset = 1;
                if (!is_ancestry) {
                    if (!sameParent(a, b)) offset += 0.25;
                    if (someSpouses(a, b)) offset += offsetOnPartners(a, b);
                    if (sameParent(a, b) && !sameBothParents(a, b)) offset += 0.125;
                }
                return offset;
            }
    
            function sameParent(a, b) { return a.parent === b.parent; }
            function sameBothParents(a, b) { 
                return (a.data?.rels?.father === b.data?.rels?.father) && (a.data?.rels?.mother === b.data?.rels?.mother); 
            }
            function hasSpouses(d) { return d.data?.rels?.spouses && d.data?.rels?.spouses.length > 0; }
            function someSpouses(a, b) { return hasSpouses(a) || hasSpouses(b); }
    
            function hierarchyGetterChildren(d) {
                return d.rels.children ? d.rels.children.map(id => data_stash.get(id)).filter(Boolean) : [];
            }
    
            function hierarchyGetterParents(d) {
                return [d.rels.father, d.rels.mother].filter(id => id && data_stash.has(id)).map(id => data_stash.get(id));
            }
    
            function offsetOnPartners(a, b) {
                return ((a.data?.rels?.spouses?.length || 0) + (b.data?.rels?.spouses?.length || 0)) * 0.5;
            }
        }
    
        
        function levelOutEachSide(parents, children) {
          const mid_diff = (parents[0].x - children[0].x) / 2;
          parents.forEach(d => d.x-=mid_diff);
          children.forEach(d => d.x+=mid_diff);
        }
      
        function mergeSides(parents, children) {
          parents.forEach(d => {d.is_ancestry = true;});
          parents.forEach(d => d.depth === 1 ? d.parent = children[0] : null);
      
          return [...children, ...parents.slice(1)];
        }
        function nodePositioning({tree}) {
          tree.forEach(d => {
            d.y *= (d.is_ancestry ? -1 : 1);
            if (is_horizontal) {
              const d_x = d.x; d.x = d.y; d.y = d_x;
            }
          });
        }
      
  
        function setupSpouses({tree, node_separation}) {
            for (let i = tree.length - 1; i >= 0; i--) {
                const d = tree[i];
                if (!d.added && !d.is_ancestry && d.data.rels.spouses?.length > 0) {
                    const side = d.data.gender === "M" ? -1 : 1;
                    d.x += d.data.rels.spouses.length / 2 * node_separation * side;
                    for (const sp_id of d.data.rels.spouses) {
                      if (!data_stash.has(sp_id)) {
                       
                      tree[i].data.rels.spouses = tree[i].data.rels.spouses.filter(spouse => spouse!=sp_id)
  
                      if (tree[i].data.rels.children) {
                        for (const child of tree[i].data.rels.children) {
                            // Locate the child node in the tree
                            const childIndex = tree.findIndex(node => node.data.id === child);
  
                            if (childIndex !== -1) { // Ensure the child exists in the tree
                                if (tree[childIndex].data.rels.mother === sp_id) {
                                    tree[childIndex].data.rels.mother = null; // Update the mother field in the tree
                         
                                }
                                if (tree[childIndex].data.rels.father === sp_id) {
                                    tree[childIndex].data.rels.father = null; // Update the father field in the tree
                                   
                                }
                            }
                        }
                    }
                    continue;
                     }
                        const spouse = {data: data_stash.get(sp_id), added: true};
                        spouse.x = d.x - node_separation * side;
                        spouse.y = d.y;
                        spouse.sx = spouse.x + (node_separation / 2) * side;
                        spouse.sy = spouse.y;
                        spouse.depth = d.depth;
                        spouse.spouse = d;
                        d.spouses = d.spouses || [];
                        d.spouses.push(spouse);
  
                        const existing_spouse = tree.findIndex(item => item.data.id == sp_id);
                        if (existing_spouse==-1){
                          tree.push(spouse);
  
  
                        } else {
                          tree[existing_spouse] = spouse
  
                        }
                    }
                }
            }
        }
  
        function setupChildrenAndParents({tree}) {
          tree.forEach(d0 => {
            delete d0.children;
            tree.forEach(d1 => {
              if (d1.parent === d0) {
                if (d1.is_ancestry) {
                  if (!d0.parents) d0.parents = [];
                  d0.parents.push(d1);
                } else {
                  if (!d0.children) d0.children = [];
                  d0.children.push(d1);
                }
              }
            });
          });
        }
      
    
        function setupProgenyParentsPos({tree}) {
            for (const d of tree) {
                if (d.is_ancestry || d.depth === 0 || d.added) continue;
              
                const m = findDatum(d.data.rels.mother);
                const f = findDatum(d.data.rels.father);
                if (m && f) {
                    const added_spouse = m.added ? m : f;
                    setupParentPos(d, added_spouse);
  
                } else if (m || f) {
                    const parent = m || f;
                    parent.sx = parent.x;
                    parent.sy = parent.y;
                    setupParentPos(d, parent);
                }
  
            }
    
            function setupParentPos(d, p) {
                d.psx = !is_horizontal ? p.sx : p.y;
                d.psy = !is_horizontal ? p.y : p.sx;
            }
            function findDatum(id) {
              return tree.find(d => d?.data?.id === id)
            }
        }
    
        function createRelsToAdd(data) {
            const to_add_spouses = new Map();
            for (const d of data.values()) {
                if (d.rels.children?.length) {
                    if (!d.rels.spouses) d.rels.spouses = [];
                    const is_father = d.data.gender === "M";
                    let spouse;
                    for (const childId of d.rels.children) {
                        const child = data.get(childId);
                        if (child.rels[is_father ? 'father' : 'mother'] !== d.id) continue;
                        if (child.rels[!is_father ? 'father' : 'mother']) continue;
                        if (!spouse) {
                            spouse = createToAddSpouse(d);
                            d.rels.spouses.push(spouse.id);
                        }
                        spouse.rels.children.push(child.id);
                        child.rels[!is_father ? 'father' : 'mother'] = spouse.id;
                    }
                }
            }
            for (const spouse of to_add_spouses.values()) data.set(spouse.id, spouse);
            return data;
    
            function createToAddSpouse(d) {
                const id = `sp-${Math.random().toString(36).substr(2, 9)}`; // Generate unique ID
                const spouse = {
                    id,
                    data: { gender: d.data.gender === "M" ? "F" : "M" },
                    rels: { spouses: [d.id], children: [] },
                    to_add: true
                };
                to_add_spouses.set(id, spouse);
                return spouse;
            }
        }
    
        function calculateTreeDim(tree, node_separation, level_separation) {
            if (is_horizontal) [node_separation, level_separation] = [level_separation, node_separation];
            const w_extent =extent(tree, d => d.x);
            const h_extent = extent(tree, d => d.y);
            return {
                width: w_extent[1] - w_extent[0] + node_separation,
                height: h_extent[1] - h_extent[0] + level_separation,
                x_off: -w_extent[0] + node_separation / 2,
                y_off: -h_extent[0] + level_separation / 2
            };
        }
  
        function sortChildrenWithSpouses(data) {
          for (const datum of data.values()) {
              if (!datum.rels.children) continue;
      
              const spouses = datum.rels.spouses || [];
              datum.rels.children.sort((a, b) => {
                  const a_d = data.get(a),
                        b_d = data.get(b),
                        a_p2 = a_d ? otherParent(a_d, datum, data) || {} : {},
                        b_p2 = b_d ? otherParent(b_d, datum, data) || {} : {},
                        a_i = spouses.indexOf(a_p2.id),
                        b_i = spouses.indexOf(b_p2.id);
      
                  return datum.data.gender === "M" ? a_i - b_i : b_i - a_i;
              });
          }
      }

      function otherParent(d, p1, data) {
        return data.get(d.rels.mother) === p1 ? data.get(d.rels.father) :
               data.get(d.rels.father) === p1 ? data.get(d.rels.mother) :
               null;
    }

    function isAllRelativeDisplayed(d, data) {
      const r = d.data.rels,
        all_rels = [r.father, r.mother, ...(r.spouses || []), ...(r.children || [])].filter(v => v);
      return all_rels.every(rel_id => data.some(d => d?.data?.id === rel_id))
    }
    })
  