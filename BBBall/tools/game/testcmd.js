var match_segment_change = function() {
    ty.Model.MatchTitle.mSegment += 1;
    ty.Model.MatchTitle.mSegment = ty.Model.MatchTitle.mSegment > 16 ? 1 : ty.Model.MatchTitle.mSegment;
    ty.Model.MatchTitle.mLevel = ty.Model.Static.MatchLevel[ty.Model.MatchTitle.mSegment - 1];
    this.reloadPlayerUI();
}