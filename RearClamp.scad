// ---------- PANEL / CLAMP PARAMETERS ----------
panel_thickness   = 3;      // thickness of the surface you clamp to
clamp_gap         = panel_thickness + 0.4; // tolerance
clamp_depth       = 12;
clamp_width       = 30;
clamp_thickness   = 3;

// Screw holes to join front plate + clamp
join_hole_d       = 3.2;    // M3 clearance
join_hole_offsetY = 10;     // distance from center up/down

module clamp_back() {
    difference() {
        // U-shaped block
        union() {
            // front leg
            translate([-clamp_width/2, -clamp_depth/2, 0])
                cube([clamp_width, clamp_depth, clamp_thickness]);

            // back leg
            translate([-clamp_width/2, -clamp_depth/2, clamp_gap + clamp_thickness])
                cube([clamp_width, clamp_depth, clamp_thickness]);

            // bridge
            translate([-clamp_width/2, -clamp_depth/2, clamp_thickness])
                cube([clamp_width, clamp_depth, clamp_gap]);
        }

        // screw holes (to join to camera plate)
        for (y = [-join_hole_offsetY, join_hole_offsetY]) {
            translate([0, y, -1])
                cylinder(h = clamp_thickness + clamp_gap + clamp_thickness + 2,
                         d = join_hole_d, $fn = 32);
        }
    }
}

clamp_back();
